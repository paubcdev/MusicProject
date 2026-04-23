export namespace main {
	
	export class AppSettings {
	    lastDirectory: string;
	    recentFiles: string[];
	    tempo: number;
	    looping: boolean;
	    countIn: boolean;
	
	    static createFrom(source: any = {}) {
	        return new AppSettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.lastDirectory = source["lastDirectory"];
	        this.recentFiles = source["recentFiles"];
	        this.tempo = source["tempo"];
	        this.looping = source["looping"];
	        this.countIn = source["countIn"];
	    }
	}

}

