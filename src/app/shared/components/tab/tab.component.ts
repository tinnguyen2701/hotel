import {AfterViewChecked, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DxTabsComponent} from 'devextreme-angular';
import {RemovedTabModel} from '@app/models/tab.model';

@Component({
    selector: 'app-tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit, AfterViewChecked {
    @Input() tabs: any[];
    @Input() selectedTab: any;
    @Input() displayExpr: string;
    @Input() valueExpr: string;
    @Input() iconExpr: string;
    @Input() showCloseIcon: boolean = false;
    @Input() showNavigate: boolean;
    @Input() height: any = '48px';
    @Input() bolderTitleTab: boolean = false;

    @Output() onRemovingTab: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRemovedTab: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSelectionChanged: EventEmitter<any> = new EventEmitter<any>();
    @Output() onInitialized: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('tab', { static: true }) tab: DxTabsComponent;

    tabHistories: any[];

    constructor() {

    }

    ngOnInit() {
        this.tabHistories = [];
        this.onRemovingTab.subscribe((e) => {
            if (!e.promise) {
                return;
            }

            e.promise.then((evt) => {
                if (evt && !evt.cancel) {
                    this.closeTab(evt.id);
                }
            });
        });
    }

    changeTab(e) {
        this.applyTabToHistory(e.addedItems[0]);

        if (!e.addedItems || !e.addedItems.length) {
            return;
        }

        this.onSelectionChanged.emit(e.addedItems[0]);
    }

    closeTab(id) {
        const removedIndex = this.tabs.findIndex(_ => _.value === id);
        this.tabs.splice(removedIndex, 1);
        this.removeTabHistory(id);

        if (this.tabHistories.length > 0) {
            this.selectedTab = this.tabHistories[this.tabHistories.length - 1];
        } else {
            this.selectedTab = this.tabs[0];
        }

        this.onRemovedTab.emit(new RemovedTabModel({removeId: id, newTabFocus: this.selectedTab}));
    }

    repaint() {
        this.tab.instance.repaint();
    }

    selectTab(index: number) {
        this.tab.instance.option('selectedIndex', index);
    }

    getSelectedIndex(): number {
        return this.tab.instance.option('selectedIndex');
    }

    applyTabToHistory(tab) {
        if (this.showCloseIcon) {

            // If current selected tab is the latest, won't insert it again
            if (this.tabHistories.length > 0 && this.tabHistories[this.tabHistories.length - 1].value === tab.value) {
                return;
            }

            this.tabHistories.push(tab);
        }
    }

    removeTabHistory(id) {
        this.tabHistories = this.tabHistories.filter(_ => _.value !== id);
    }

    ngAfterViewChecked(): void {
        this.onInitialized.emit();
    }

    closingTab(id) {
        if (this.onRemovingTab.observers.length < 2 || this.onRemovingTab.observers[1] === undefined) {
            this.closeTab(id);
        } else {
            this.onRemovingTab.emit({
                cancel: false,
                id
            });
        }
    }
}
