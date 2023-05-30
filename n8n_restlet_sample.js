/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope Public
 */

define(['N/https', 'N/runtime'], function (https, runtime) {
	function response(context, body, method) {
		if (method === 'GET' || method === 'DELETE') {
			return {
				request: {
					parameters: context
				},
				response: {
					timestamp: new Date(),
					body
				}
			};
		}
		if (method === 'POST' || method === 'PUT') {
			return {
				request: {
					body: context
				},
				response: {
					timestamp: new Date(),
					body
				}
			};
		}
	}

	function handleGetRequest(context) {
		// Perform operations and set response body to send back to n8n
		let body = {
			sample_response: "sample response data"
		};
		return response(context, body, 'GET');
	}

	function handlePostRequest(context) {
		// Perform operations and set response body to send back to n8n
		let body = {
			sample_response: "sample response data"
		};
		return response(context, body, 'POST');
	}

	function handlePutRequest(context) {
		// Perform operations and set response body to send back to n8n
		let body = {
			sample_response: "sample response data"
		};
		return response(context, body, 'PUT');
	}

	function handleDeleteRequest(context) {
		// Perform operations and set response body to send back to n8n
		let body = {
			sample_response: "sample response data"
		};
		return response(context, body, 'DELETE');
	}

	return {
		get: handleGetRequest,
        post: handlePostRequest,
        put: handlePutRequest,
        delete: handleDeleteRequest
	};
});