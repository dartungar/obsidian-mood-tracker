export class Plugin {
    app: any = {};
    manifest: any = {};
    async loadData() { return {}; }
    async saveData(_data: any) { return; }
    addCommand(_command: any) { return; }
    addRibbonIcon(_icon: string, _title: string, _callback: Function) { return; }
    addSettingTab(_tab: any) { return; }
    registerMarkdownCodeBlockProcessor(_name: string, _cb: Function) { return; }
}

export class Notice {
    noticeEl: any = { append: () => {} };
    constructor(_message: string, _duration?: number) {}
}

export class Modal {
    constructor(_app: any) {}
    open() {}
    close() {}
    setContent(_content: string) { return this; }
}

export class Setting {
    constructor(_containerEl: any) {}
    setName(_name: string) { return this; }
    setDesc(_desc: string) { return this; }
    addText(_cb: Function) { return this; }
    addDropdown(_cb: Function) { return this; }
    addToggle(_cb: Function) { return this; }
    addButton(_cb: Function) { return this; }
    addColorPicker(_cb: Function) { return this; }
    addExtraButton(_cb: Function) { return this; }
}

export class PluginSettingTab {
    containerEl: any = { empty: () => {}, createEl: () => ({}) };
    constructor(_app: any, _plugin: any) {}
    display() {}
}

export class ButtonComponent {
    constructor(_containerEl: any) {}
    setButtonText(_text: string) { return this; }
    onClick(_cb: Function) { return this; }
}

export class TFile {}
export class TFolder {}

export function debounce(fn: Function, _delay: number, _immediate?: boolean) {
    return fn;
}
