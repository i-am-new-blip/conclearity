// ===== basic types =====

export type Author = {
    name: string;
    id: bigint;
};

export type BaseSetting = {
    description?: string;
    placeholder?: string;
    restartNeeded?: boolean;
    hidden?: boolean;
    onChange?: (value: any) => void;
};

// ===== setting types =====

export type StringSetting = BaseSetting & {
    type: "STRING";
    default?: string;
};

export type NumberSetting = BaseSetting & {
    type: "NUMBER";
    default?: number;
};

export type BigIntSetting = BaseSetting & {
    type: "BIGINT";
    default?: bigint;
};

export type BooleanSetting = BaseSetting & {
    type: "BOOLEAN";
    default?: boolean;
};

export type SelectOption = {
    label: string;
    value: string | number | boolean;
    default?: boolean;
};

export type SelectSetting = BaseSetting & {
    type: "SELECT";
    options?: SelectOption[];
};

export type SliderSetting = BaseSetting & {
    type: "SLIDER";
    markers: number[];
    default?: number;
    stickToMarkers?: boolean;
};

export type ComponentSetting = BaseSetting & {
    type: "COMPONENT";
    component: () => any;
    default?: any;
};

export type CustomSetting = {
    type: "CUSTOM";
    default?: any;
    onChange?: (value: any) => void;
};

// union of all settings
export type Setting =
    | StringSetting
    | NumberSetting
    | BigIntSetting
    | BooleanSetting
    | SelectSetting
    | SliderSetting
    | ComponentSetting
    | CustomSetting;

// ===== plugin type =====

export type Plugin = {
    name: string;
    description: string;
    authors: Author[];

    start: () => void;
    stop: () => void;

    dependencies?: string[];
    required?: boolean;
    hidden?: boolean;
    enabledByDefault?: boolean;

    settings?: Setting[];
};