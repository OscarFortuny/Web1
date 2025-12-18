export interface Missatge {
    missatge_id: number;
    grup_id: number;
    usuari_id: number;
    usuari_name: string;
    text: string;
    timestamp: Date | string;
}

export interface SendMissatgeRequest {
    usuari_id: number | string;
    usuari_name: string;
    text: string;
}

export interface SendMissatgeResponse {
    success: boolean;
    missatge?: Missatge;
    error?: string;
}
