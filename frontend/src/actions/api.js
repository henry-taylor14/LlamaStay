import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_PB_URL);

export default {
  llama() {
    return {
      fetchAll: () => pb.collection('llamas').getFullList({ sort: 'created,id' }),
      create: newLlama => pb.collection('llamas').create(newLlama),
      update: (id, updatedRecord) =>
        pb.collection('llamas').update(id, updatedRecord),
      remove: id => pb.collection('llamas').delete(id),
      shear: id => pb.send(`/api/llamas/${id}/shear`, { method: 'POST' }),
    };
  },
};
