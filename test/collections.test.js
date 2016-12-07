import collections from '../lib/utils/collections';

describe('Collections', () => {
  it('test updateInCollection', () => {
    const collection = [
      { name: 'Alice', age: 21 },
      { name: 'Bob', age: 22 },
      { name: 'Charlie', age: 23 },
    ];
    const updated = collections.updateInCollection(collection, 1, { name: 'Daniel' });
    expect(updated[0].name).toEqual('Alice');
    expect(updated[1].name).toEqual('Daniel');
    expect(updated[1].age).toEqual(22);
  });
  it('test updateCollection', () => {
    const collection = [
      { name: 'Alice', age: 21 },
      { name: 'Bob', age: 22 },
      { name: 'Charlie', age: 23 },
    ];
    const updated = collections.updateCollection(collection, { name: 'Daniel' });
    expect(updated[0].name).toEqual('Daniel');
    expect(updated[1].name).toEqual('Daniel');
    expect(updated[2].name).toEqual('Daniel');
  });
  it('test popAtIndex', () => {
    const collection = [
      { name: 'Alice', age: 21 },
      { name: 'Bob', age: 22 },
      { name: 'Charlie', age: 23 },
    ];
    let updated;
    updated = collections.popAtIndex(collection, 1);
    expect(updated.length).toEqual(2);
    expect(updated[0].name).toEqual('Alice');
    expect(updated[1].name).toEqual('Charlie');

    updated = collections.popAtIndex(collection, 0);
    expect(updated.length).toEqual(2);
    expect(updated[0].name).toEqual('Bob');
    expect(updated[1].name).toEqual('Charlie');

    updated = collections.popAtIndex(collection, 2);
    expect(updated.length).toEqual(2);
    expect(updated[0].name).toEqual('Alice');
    expect(updated[1].name).toEqual('Bob');

    updated = collections.popAtIndex(collection, -1);
    expect(updated.length).toEqual(2);
    expect(updated[0].name).toEqual('Alice');
    expect(updated[1].name).toEqual('Bob');
  });
});
