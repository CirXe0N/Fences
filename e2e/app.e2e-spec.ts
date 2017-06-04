import { FencesPage } from './app.po';

describe('fences App', () => {
  let page: FencesPage;

  beforeEach(() => {
    page = new FencesPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
