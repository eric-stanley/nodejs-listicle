async function toReject(promise) {
  let rejected;
  try {
    await promise;
    rejected = false;
  } catch {
    rejected = true;
  }

  return {
    pass: rejected,
    message: () => `expected promise to ${rejected ? 'resolve' : 'reject'}`,
  };
}

async function toResolve(promise) {
  let resolved;
  try {
    await promise;
    resolved = true;
  } catch {
    resolved = false;
  }

  return {
    pass: resolved,
    message: () => `expected promise to ${resolved ? 'reject' : 'resolve'}`,
  };
}

expect.extend({
  toReject,
  toResolve,
});
