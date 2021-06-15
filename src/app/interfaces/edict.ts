import * as fire from 'firebase';

export interface Edict {
    edictId?: string;
    companyId: string;
    title: string;
    content: string;
    createdAt: Date | fire.default.firestore.Timestamp;
    profilesApplied?: string[];
}