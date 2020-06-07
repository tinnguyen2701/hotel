import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    DxAccordionModule, DxAutocompleteModule, DxButtonModule, DxMenuModule,
    DxChartModule, DxCheckBoxModule, DxColorBoxModule, DxToolbarModule,
    DxContextMenuModule, DxDataGridModule, DxDateBoxModule, DxDropDownBoxModule,
    DxDropDownButtonModule, DxFileUploaderModule, DxFormModule,
    DxHtmlEditorModule, DxListModule, DxLoadIndicatorModule, DxLoadPanelModule,
    DxNumberBoxModule, DxPivotGridModule, DxPopoverModule,
    DxPopupModule, DxProgressBarModule, DxRadioGroupModule, DxSchedulerModule,
    DxScrollViewModule, DxSelectBoxModule, DxSliderModule, DxSwitchModule,
    DxTabPanelModule, DxTabsModule, DxTagBoxModule,
    DxTextAreaModule, DxTextBoxModule, DxTooltipModule, DxTreeListModule, DxTreeViewModule,
    DxValidationGroupModule, DxValidationSummaryModule, DxValidatorModule, DxDrawerModule
} from 'devextreme-angular';

import {DefaultLayoutComponent, SingleCardLayoutComponent, SidebarLayoutComponent} from './layouts';
import {
    ErrorComponent,
    FooterComponent,
    HeaderComponent,
    SideNavigationMenuComponent,
    PopupContainerComponent,
    UserPanelComponent,
    RouterOutletComponent
} from './components';
import {AutoFocusInputDirective} from './directives';

//
const DEVEXTREME_MODULES = [
    DxButtonModule, DxDropDownButtonModule, DxDrawerModule, DxMenuModule,
    DxToolbarModule, DxTextBoxModule, DxScrollViewModule, DxListModule, DxDataGridModule,
    DxTagBoxModule, DxValidatorModule, DxValidationGroupModule, DxValidationSummaryModule,
    DxCheckBoxModule, DxPopupModule, DxPopoverModule, DxTabPanelModule, DxTreeListModule,
    DxTextAreaModule, DxSelectBoxModule, DxDateBoxModule, DxChartModule, DxContextMenuModule,
    DxFormModule, DxSliderModule, DxNumberBoxModule, DxHtmlEditorModule, DxSchedulerModule,
    DxFileUploaderModule, DxAccordionModule, DxSwitchModule, DxPivotGridModule, DxTabsModule, DxLoadIndicatorModule,
    DxLoadPanelModule, DxTooltipModule, DxProgressBarModule, DxColorBoxModule,
    DxDropDownBoxModule, DxTreeViewModule, DxRadioGroupModule, DxAutocompleteModule
];
//
const BASE_MODULES = [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
];

// Components for this module only
const COMPONENTS = [
    UserPanelComponent,
    //
    HeaderComponent,
    SideNavigationMenuComponent,
    FooterComponent,
    ErrorComponent,
    PopupContainerComponent,
    RouterOutletComponent,
    //
    SingleCardLayoutComponent,
    SidebarLayoutComponent,
    DefaultLayoutComponent
];

//
const DIRECTIVES = [
    AutoFocusInputDirective
];
//
const PIPES = [];

@NgModule({
    imports: [
        ...DEVEXTREME_MODULES,
        ...BASE_MODULES
    ],
    declarations: [
        ...DIRECTIVES,
        ...PIPES,
        ...COMPONENTS,
    ],
    exports: [
        ...DEVEXTREME_MODULES,
        ...BASE_MODULES,
        ...DIRECTIVES,
        ...PIPES,
        ...COMPONENTS
    ]
})
export class ThemeModule {
}
