export namespace backend {
	
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

}

