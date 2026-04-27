const mongoose = require('mongoose');
const dns = require('dns');
const uri = 'mongodb+srv://vekshithakutagulla_db_user:vekshitha123@cluster0.w9jwyjf.mongodb.net/?appName=Cluster0';

dns.resolveSrv('_mongodb._tcp.cluster0.w9jwyjf.mongodb.net', (err, records) => {
  console.log('SRV records:', err || records);
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('MongoDB connected');
      process.exit(0);
    })
    .catch((connectErr) => {
      console.error('MongoDB connect error:', connectErr);
      process.exit(1);
    });
});
