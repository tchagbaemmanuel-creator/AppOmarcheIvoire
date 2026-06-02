import AppError from "@/utils/AppError";

interface QueueItem {
    id: string;
    type: string;
    data: any;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

let queueItems: QueueItem[] = [];

export async function addToQueue(type: string, data: any): Promise<QueueItem> {
    try {
        const queueItem: QueueItem = {
            id: crypto.randomUUID(),
            type,
            data,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        queueItems.push(queueItem);
        return queueItem;
    } catch (error) {
        throw new AppError("Erreur lors de l'ajout à la file d'attente", 500, error as Error);
    }
}

export async function getQueueItem(id: string): Promise<QueueItem | null> {
    try {
        const item = queueItems.find(item => item.id === id);
        if (!item) {
            throw new AppError("Élément de file d'attente introuvable", 404, new Error(`Queue item with ID ${id} not found`));
        }
        return item;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Erreur lors de la récupération de l'élément de la file d'attente", 500, error as Error);
    }
}

export async function updateQueueItemStatus(id: string, status: QueueItem['status']): Promise<QueueItem> {
    try {
        const item = await getQueueItem(id);
        if (!item) {
            throw new AppError("Élément de file d'attente introuvable", 404, new Error(`Queue item with ID ${id} not found`));
        }

        item.status = status;
        item.updatedAt = new Date();
        return item;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Erreur lors de la mise à jour du statut de l'élément de la file d'attente", 500, error as Error);
    }
}

export async function removeFromQueue(id: string): Promise<void> {
    try {
        const initialLength = queueItems.length;
        queueItems = queueItems.filter(item => item.id !== id);
        
        if (queueItems.length === initialLength) {
            throw new AppError("Élément de file d'attente introuvable", 404, new Error(`Queue item with ID ${id} not found`));
        }
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Erreur lors de la suppression de l'élément de la file d'attente", 500, error as Error);
    }
}

export async function getQueueItems(status?: QueueItem['status']): Promise<QueueItem[]> {
    try {
        if (status) {
            return queueItems.filter(item => item.status === status);
        }
        return queueItems;
    } catch (error) {
        throw new AppError("Erreur lors de la récupération des éléments de la file d'attente", 500, error as Error);
    }
}