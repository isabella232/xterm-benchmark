const RuntimeCase = require('../lib/index').RuntimeCase;
const before = require('../lib/index').before;
const beforeEach = require('../lib/index').beforeEach;
const after = require('../lib/index').after;
const afterEach = require('../lib/index').afterEach;
const perfContext = require('../lib/index').perfContext;
const ThroughputRuntimeCase = require('../lib/index').ThroughputRuntimeCase;
const PerfCase = require('../lib/index').PerfCase;
const mixins = require('../lib/mixins');
const descriptiveStats = require('../lib/helper').descriptiveStats;


let a = 'grrrr';

before(() => {
  console.log('before - file level');
  a = 'better';
});

beforeEach(() => {
  console.log('beforeEach - file level');
});

after(() => {
  console.log('after - file level');
});

afterEach(() => {
  console.log('afterEach - file level');
});

new RuntimeCase('Hello World - file level', () => {
  const values = [];
  for (i = 0; i < 100000; ++i) {
    values.push(i);
  }
  return a;
}).showRuntime().showAverageRuntime();

perfContext('ctx1', () => {
  before(() => {
    console.log('before - ctx1');
  });

  let b = 'nonono';
  
  beforeEach(() => {
    console.log('beforeEach - ctx1');
    b = 'good';
  });
  
  after(() => {
    console.log('after - ctx1');
  });
  
  afterEach(() => {
    console.log('afterEach - ctx1');
  });
  
  new RuntimeCase('Hello World - ctx1', () => {
    const values = [];
    for (i = 0; i < 1000000; ++i) {
      values.push(i);
    }
    return b;
  }, {repeat: 10}).showRuntime().showAverageRuntime();

  perfContext('inner ctx', () => {

  });

  new ThroughputRuntimeCase('yeah throughput', () => {
    const s = 'a'.repeat(100000);
    const values = [];
    for (i = 0; i < s.length; ++i) {
      values.push(s.charCodeAt(i));
    }
    return 10000;
  }, {repeat: 10}).showRuntime().showAverageRuntime().showThroughput().showAverageThroughput();
});

// mixin in JS with some custom baseline data record
// --> entry in summary must contain the values and the descriptive stats
// --> can be arbitrary depth to get accounted for baseline
const Mixed = mixins.Throughput(mixins.Runtime(PerfCase));
new Mixed('mixins in JS', () => {
  console.log('works?');
  return {payloadSize: 1000000};
}).showAverageRuntime().showAverageThroughput().postAll((results, perf) => {
  const values = [1,2,3,4,5];
  perf.summary['custom'] = Object.assign({values}, descriptiveStats(values));
  perf.summary['customWithSubs'] = {
    sub1: Object.assign({values}, descriptiveStats(values)),
    sub2: {
      subsub: Object.assign({values}, descriptiveStats(values))
    }
  };
});
