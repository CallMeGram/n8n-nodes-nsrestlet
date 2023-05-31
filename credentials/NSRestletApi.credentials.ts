import { ICredentialType, INodeProperties } from "n8n-workflow";

export class NSRestletApi implements ICredentialType {
	name = 'ns-restletApi';
	displayName = 'NetSuite Restlet API';
	properties: INodeProperties[] = [
		{
			displayName: 'Consumer Key',
			name: 'consumer_key',
			type: 'string',
			default: ''
		},
		{
			displayName: 'Consumer Secret',
			name: 'consumer_secret',
			type: 'string',
			default: ''
		},
		{
			displayName: 'Token ID',
			name: 'token_id',
			type: 'string',
			default: ''
		},
		{
			displayName: 'Token Secret',
			name: 'token_secret',
			type: 'string',
			default: ''
		},
		{
			displayName: 'NetSuite Account',
			name: 'realm',
			type: 'string',
			default: ''
		},
	];
}
