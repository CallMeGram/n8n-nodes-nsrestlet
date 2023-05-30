import { ICredentialType, NodePropertyTypes } from 'n8n-workflow';

export class NSRestletCreds implements ICredentialType {
	name = 'NSRestletCreds';
	displayName = 'NetSuite Authentication Credentials';
	properties = [
		{
			displayName: 'Consumer Key',
			name: 'consumer_key',
			type: 'string' as NodePropertyTypes,
			default: ''
		},
		{
			displayName: 'Consumer Secret',
			name: 'consumer_secret',
			type: 'string' as NodePropertyTypes,
			default: ''
		},
		{
			displayName: 'Token ID',
			name: 'token_id',
			type: 'string' as NodePropertyTypes,
			default: ''
		},
		{
			displayName: 'Token Secret',
			name: 'token_secret',
			type: 'string' as NodePropertyTypes,
			default: ''
		},
		{
			displayName: 'NetSuite Account',
			name: 'realm',
			type: 'string' as NodePropertyTypes,
			default: ''
		},
	];
}
