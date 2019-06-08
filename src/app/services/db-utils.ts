export function convertSnaps<T>(snaps) {
    return <T[]>snaps.map(snap => {
        return {
            id: snap.payload.doc.id,
            ...snap.payload.doc.data()
        };
    });
}

export function convertValueChanges<T>(snaps) {
    return <T[]>snaps.map(snap => <T>snap);
}
