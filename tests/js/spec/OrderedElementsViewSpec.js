function make_group(data) {
  data = data || {};

  return new app.Group({
    id: data.id || 1,
    score: data.score || 5,
    count: 1,
    permalink: 'http://example.com',
    title: 'test',
    message: 'test message',
    lastSeen: '2012-01-13T08:15:36Z',
    timeSpent: 0,
    project: 'default',
    canResolve: false,
    logger: 'root',
    versions: [],
    tags: []
  });
}

describe("OrderedElementsView", function() {
  var view;
  var group1;
  var group2;
  var group3;
  var group4;

  beforeEach(function() {
    view = new app.OrderedElementsView({
        id: 'foo',
        maxItems: 3
    });
    view.$parent = $('<ul></ul>');
  });

  it("should bind a collection", function() {
    expect(view.collection);
  });

  describe(".extend", function() {
    it("calls addMember for each item", function() {
      group1 = make_group({id: 1, score: 3});
      group2 = make_group({id: 2, score: 5});

      view.addMember = sinon.spy();
      view.extend([group1, group2]);
      expect(view.addMember.callCount).toBe(2);
      expect(view.addMember.calledWith(group1));
      expect(view.addMember.calledWith(group2));
    });
  });

  describe(".addMember", function() {
    it("adds to collection", function() {
      group = make_group();
      view.addMember(group);
      expect(view.collection.models[0].get('id')).toBe(group.id);
    });

    it("replaces in collection", function() {
      group = make_group();
      view.addMember(group);
      view.addMember(group);
      view.addMember(group);
      expect(view.collection.length).toBe(1);
    });

    it("truncated to max items", function(){
      group1 = make_group({id: 1, score: 3});
      group2 = make_group({id: 2, score: 5});
      group3 = make_group({id: 3, score: 2});
      group4 = make_group({id: 4, score: 6});

      view.addMember(group1);
      view.addMember(group2);
      view.addMember(group3);
      view.addMember(group4);

      expect(view.collection.length).toBe(3);
    });

    it("sorts members by score after insert", function(){
      view.addMember(make_group({id: 1, score: 3}));
      view.addMember(make_group({id: 2, score: 5}));

      expect(view.collection.models[0].get('id')).toBe(2);
      expect(view.collection.models[1].get('id')).toBe(1);
    });
  });

  describe(".renderMemberInContainer", function() {
    beforeEach(function(){
      group1 = make_group({id: 1, score: 3});
      group2 = make_group({id: 2, score: 5});
      group3 = make_group({id: 3, score: 2});

      view.addMember(group1);
      view.addMember(group2);
      view.addMember(group3);
    });

    it("has the correct number of elements", function(){
      expect(view.$parent.find('li').length).toBe(view.collection.models.length);
    });

    it("has list elements sorted correctly", function(){
      view.$parent.find('li').each(function(_, el){
        expect(this.id).toBe('foo' + view.collection.models[_].id);
      });
    });
  });
});