export type Equipment = {
    id: string;
    title: string;
    is_active: boolean;
    date_created: string;
    date_updated: string;
};

export type NewEquipment = Omit<Equipment, 'id'>;
