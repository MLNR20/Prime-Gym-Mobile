export type Program = {
    id: string;
    name: string;
    description: string;
    date_created: string;
    date_updated: string;
};

export type NewProgram = Omit<Program, 'id'>;
