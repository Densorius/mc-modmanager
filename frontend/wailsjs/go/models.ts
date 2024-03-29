export namespace backend {
	
	export class GetArchiveInfoResult {
	    Json: string;
	    Message: string;
	    StatusCode: string;
	
	    static createFrom(source: any = {}) {
	        return new GetArchiveInfoResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Json = source["Json"];
	        this.Message = source["Message"];
	        this.StatusCode = source["StatusCode"];
	    }
	}
	export class MoveFileResult {
	    File: string;
	    Message: string;
	    StatusCode: string;
	
	    static createFrom(source: any = {}) {
	        return new MoveFileResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.File = source["File"];
	        this.Message = source["Message"];
	        this.StatusCode = source["StatusCode"];
	    }
	}
	export class OpenFileDialogResult {
	    Files: string[];
	    Message: string;
	    StatusCode: string;
	
	    static createFrom(source: any = {}) {
	        return new OpenFileDialogResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Files = source["Files"];
	        this.Message = source["Message"];
	        this.StatusCode = source["StatusCode"];
	    }
	}
	export class DeleteFileResult {
	    Message: string;
	    StatusCode: string;
	
	    static createFrom(source: any = {}) {
	        return new DeleteFileResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Message = source["Message"];
	        this.StatusCode = source["StatusCode"];
	    }
	}

}

