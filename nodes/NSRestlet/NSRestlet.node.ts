import { IExecuteFunctions } from 'n8n-core';
import { INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { OptionsWithUri } from 'request';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

export class NSRestlet implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'NetSuite Restlet',
		name: 'NSRestlet',
		description: 'This package allows for a \"single-node\" method of connecting your n8n instance with your NetSuite Restlet',
		icon: 'file:NSRestlet.svg',
		group: ['transform'],
		version: 1,
		defaults: {
			name: 'NetSuite Restlet',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'ns-restletApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Restlet URL',
				name: 'restlet_url',
				type: 'string',
				required: true,
				placeholder: "ex: https://1234567.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=1&deploy=1",
				default: ''
			},
			{
				displayName: 'Method',
				name: 'request_method',
				type: 'options',
				required: true,
				options: [
					{
						name: 'GET',
						value: 'GET',
					},
					{
						name: 'POST',
						value: 'POST',
					},
					{
						name: 'PUT',
						value: 'PUT',
					},
					{
						name: 'DELETE',
						value: 'DELETE',
					}
				],
				default: 'POST'
			},
			{
				displayName: 'Query Parameters',
				name: 'queryParameters',
				type: 'fixedCollection',
				displayOptions: {
					show: {
						request_method: ["GET", "DELETE"]
					},
				},
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add Parameter',
				default: {
					parameters: [
						{
							name: '',
							value: '',
						},
					],
				},
				options: [
					{
						name: 'parameters',
						displayName: 'Parameter',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'Request Body',
				name: 'request_body',
				displayOptions: {
					show: {
						request_method: ["POST", "PUT"]
					},
				},
				type: 'json',
				default: '',
			}
		]
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const credentials = await this.getCredentials('ns-restletApi');
		const consumer_key = credentials.consumer_key as string;
		const consumer_secret = credentials.consumer_secret as string;
		const token_id = credentials.token_id as string;
		const token_secret = credentials.token_secret as string;
		const realm = credentials.realm as string;
		const request_method = this.getNodeParameter('request_method', 0) as string;
		let restlet_url = this.getNodeParameter('restlet_url', 0) as string;
		let body: any, query_params: any, query_string_array: any = [], query_string: any;

		if (request_method === 'GET' || request_method === 'DELETE') {
			body = {};
			query_params = this.getNodeParameter('queryParameters', 0) as string;
			query_params = JSON.parse(JSON.stringify(query_params)).parameters;
			for (let x in query_params) {
				let key = encodeURIComponent(query_params[x].name);
				let value = encodeURIComponent(query_params[x].value);
				if (key !== '' && value !== '') {
					query_string_array.push(`${key}=${value}`);
				}
			}
			if (query_string_array.length > 0) {
				query_string = query_string_array.join('&');
				restlet_url += `&${query_string}`;
			}
		}
		if (request_method === 'POST' || request_method === 'PUT') {
			body = this.getNodeParameter('request_body', 0);
			if (body === '') {
				body = {}
			}
		}

		const oauth = new OAuth({
			consumer: {
				key: consumer_key,
				secret: consumer_secret,
			},
			signature_method: 'HMAC-SHA256',
			realm: realm,
			hash_function(base_string: any, key: any) {
				return crypto
					.createHmac('sha256', key)
					.update(base_string)
					.digest('base64');
			}
		});

		const authRequest = {
			url: restlet_url,
			method: request_method
		};

		const tokenData = {
			key: token_id,
			secret: token_secret
		};

		const headers = {
			'Accept': 'application/json',
			'Prefer': 'transient',
			'Authorization': oauth.toHeader(oauth.authorize(authRequest, tokenData)).Authorization
		};

		const requestOptions: OptionsWithUri = {
			headers,
			method: request_method,
			body: body,
			uri: restlet_url,
			json: true,
		};

		const responseData = await this.helpers.request(requestOptions);

		return [this.helpers.returnJsonArray(responseData)];
	}
}
