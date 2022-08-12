

export interface CommandInput {
	action: string;
	params: Record<string, string | number | boolean>;
}

export interface CommandResponse {

    /**
     * The command input params.
     */
	input : CommandInput;
    /**
     * Command execution time in milliseconds.
     */
	duration: number;

    /**
     * The command result
     */
	result: any;
}

export interface ErrorResponse {
    /**
     * The error message
     */
    error: string;
    /**
     * The request path.
     */
    path: string;
    /**
     * The request params.
     */
	params: Record<string, any>;
}
