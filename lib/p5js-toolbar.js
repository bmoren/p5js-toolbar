'use babel';

const opn = require('opn');


import P5jsToolbarView from './p5js-toolbar-view';
import { CompositeDisposable } from 'atom';

export default {

  p5jsToolbarView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.p5jsToolbarView = new P5jsToolbarView(state.p5jsToolbarViewState);
    this.modalPanel = atom.workspace.addTopPanel({
      item: this.p5jsToolbarView.getElement(),
      visible: false,
      priority: 1
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'p5js-toolbar:toggle': () => this.toggle(),
      'p5js-toolbar:start': () => this.p5jsToolbarView.startServer(),
      'p5js-toolbar:stop': () => this.p5jsToolbarView.stopServer(),
      'p5js-toolbar:reference': () => opn("http://p5js.org/reference"),
      'p5js-toolbar:report-issue': () => opn("https://github.com/processing/p5.js/issues"),
      'p5js-toolbar:forum': () => opn("https://discourse.processing.org/c/p5js"),
      'p5js-toolbar:new-project': () => this.p5jsToolbarView.generateNewProject()

    }));

  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.p5jsToolbarView.destroy();
  },

  serialize() {
    return {
      p5jsToolbarViewState: this.p5jsToolbarView.serialize()
    };
  },

  toggle() {
    console.log('P5jsToolbar was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide(this.p5jsToolbarView.stopServer()) :
      this.modalPanel.show()
    );
  }
};
