import merge from 'deepmerge';

const modelState = {
  applications: {},
  machines: {},
  models: {},
  units: {}
};

/**
  Processes the delta objects from the Juju websocket messages.
  @param {Object} deltas The delta objects from the Juju megawatcher messages.
  @return {Object} The new model state object.
*/
function processDelta(deltas) {
  deltas.forEach(delta => {
    // If there is a handler for the delta type then pass the data to it.
    // delta[0] will be one of 'relation', 'application', 'machine', 'relation',
    // 'unit'.
    // Our server adds another non-standard delta called 'model' for sending
    // the model info down the same stream. See server/juju.js for how this is
    // performed.
    // For this application we're only concerned with the 'application',
    // 'machine', and 'unit' deltas as well as the non-standard 'model' delta.
    if (['application', 'machine', 'model', 'unit'].includes(delta[0])) {
      const data = delta[2];
      const section = modelState[delta[0] + 's'];
      // The key value differs depending on the delta.
      const key = delta[0] === 'machine' ? 'id' : 'name';
      switch (delta[1]) {
        case 'change':
          if (!section[data[key]]) {
            section[data[key]] = {};
          }
          section[data[key]] = merge(section[data[key]], data);
          break;
        case 'remove':
          delete section[data[key]];
          break;
      }
    }
  });
  return modelState;
}

export default processDelta;
