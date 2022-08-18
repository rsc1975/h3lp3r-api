

export interface CommandInput {
	action: string;
	params: Record<string, string | number | boolean>;
}


type ResultType = string | number | boolean | Array<unknown> | Record<string, unknown>;

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
	result: ResultType;
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
     params: Record<string, string | string[]>;
}
