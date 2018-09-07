

let getChildren = (snap) =>{
  let result = [];
  let val = snap.val();
  for (const valElement in val) {
    result.push(val[valElement]);
  }
  return result;
};

let getFirstKeyFromSnapshot = (snap) => {
  let val = snap.val();
  return Object.keys(val)[0];
};

module.exports = {getChildren, getFirstKeyFromSnapshot};
