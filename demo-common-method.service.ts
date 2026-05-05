import { Injectable } from '@angular/core';
// Need for later use
// import { fromEvent, Subscription } from 'rxjs';
// export class MFE_EVENT {
//     private static readonly IS_DEMO_APP = "IS_DEMO_APP";
// }

@Injectable({ providedIn: 'root' })

export class DemoCommonMethodService {

    // Need for later use
    // private subscriptions: Subscription[] = [];
    // private isDemoApp_all_Domains: boolean = false;

    private practiceIndustry = localStorage.getItem('practice_industry_for_demo') || 'dental';

    private allowedHostName: Record<string, string[]> = {
        stageDemo: ["stage-demo.adit.com", "localhost"],
        dental: ["demo.adit.com"],
        optometry: ["opto.adit.com"],
        chiropractor: ["chiro.adit.com"],
        orthodontics: ["ortho.adit.com"],
    };

    private isDemoApp_all_Domains: boolean = Object.values(this.allowedHostName).flat().includes(window.location.hostname);
    private isDemoApp_Stage_Domain: boolean = this.allowedHostName.stageDemo.includes(window.location.hostname);
    private isDemoApp_Dental_Domain: boolean = this.allowedHostName.dental.includes(window.location.hostname);
    private isDemoApp_Opto_Domain: boolean = this.allowedHostName.optometry.includes(window.location.hostname);
    private isDemoApp_Chiro_Domain: boolean = this.allowedHostName.chiropractor.includes(window.location.hostname);
    private isDemoApp_Ortho_Domain: boolean = this.allowedHostName.orthodontics.includes(window.location.hostname);


    constructor() {
        console.info("Module name - Domain Flag - isDemoApp: ", this.isDemoApp_all_Domains);
    }

    public listenEvent() {
        // Need for later use
        // console.info("LISTEN TO DEMO EVENT");
        // this.subscriptions.push(fromEvent(window, MFE_EVENT.IS_DEMO_APP).subscribe(({ detail }: any) => {
        //     this.isDemoApp_all_Domains = detail;
        // }));
    }

    public removeAllSubscription() {
        // Need for later use
        // console.info("REMOVED ALL EVENTS");
        // if (this.subscriptions && this.subscriptions.length) { this.subscriptions.forEach((s) => s.unsubscribe()); }
    }

    public get isOrthodontics() { return this.practiceIndustry === 'orthodontics' || this.isDemoApp_Ortho_Domain; }
    public get isOptometry() { return this.practiceIndustry === 'optometry' || this.isDemoApp_Opto_Domain; }
    public get isChiropractor() { return this.practiceIndustry === 'chiropractor' || this.isDemoApp_Chiro_Domain; }
    public get isDental() { return this.practiceIndustry === 'dental' || this.isDemoApp_Dental_Domain; }

    public get isDemoApp() {
        return this.isDemoApp_all_Domains;
    }
}