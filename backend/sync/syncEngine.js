const { LocalData, CloudData } = require('../models/DataModel');
const { SYNC_DIRECTION } = require('../config');

// Conflict resolution: pick latest
const resolveConflict = async (local, cloud) => {
  if (new Date(local.lastModified) > new Date(cloud.lastModified)) {
    await CloudData.upsert(local);
  } else {
    await LocalData.upsert(cloud);
  }
};

const syncData = async () => {
  const localDocs = await LocalData.findAll();
  const cloudDocs = await CloudData.findAll();

  const cloudMap = new Map(cloudDocs.map(doc => [doc.id, doc.dataValues]));
  const localMap = new Map(localDocs.map(doc => [doc.id, doc.dataValues]));

  if (SYNC_DIRECTION === 'local-to-cloud' || SYNC_DIRECTION === 'bidirectional') {
    for (const local of localDocs.map(doc => doc.dataValues)) {
      const cloud = cloudMap.get(local.id);
      if (!cloud) {
        await CloudData.upsert(local);
      } else if (new Date(local.lastModified).getTime() !== new Date(cloud.lastModified).getTime()) {
        if (SYNC_DIRECTION === 'bidirectional') {
          await resolveConflict(local, cloud);
        }
      }
    }
  }

  if (['cloud-to-local', 'bidirectional', 'cloud-overwrites-local'].includes(SYNC_DIRECTION)) {
    for (const cloud of cloudDocs.map(doc => doc.dataValues)) {
      const local = localMap.get(cloud.id);
      if (!local) {
        await LocalData.upsert(cloud);
      } else if (new Date(local.lastModified).getTime() !== new Date(cloud.lastModified).getTime()) {
        if (SYNC_DIRECTION === 'cloud-overwrites-local') {
          await LocalData.upsert(cloud);
        } else if (SYNC_DIRECTION === 'bidirectional') {
          await resolveConflict(local, cloud);
        }
      }
    }
  }

  console.log(`[SYNC] Completed at ${new Date().toLocaleTimeString()}`);
};

module.exports = syncData;
