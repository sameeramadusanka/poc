import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MonacoEditorModule, NgxMonacoEditorConfig  } from 'ngx-monaco-editor';
import { AppComponent } from './app.component';


const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'assets', // configure base path cotaining monaco-editor directory after build default: './assets'
  defaultOptions: { scrollBeyondLastLine: true }, // pass default options to be used
  onMonacoLoad: () => {
    // here monaco object will be available as window.monaco use this function to extend monaco editor functionalities.
    (<any>window).monaco.languages.register({ id: 'mySpecialLanguage' });

    (<any>window).monaco.languages.setMonarchTokensProvider('mySpecialLanguage', {

      keywords: [
        'map', 'flatMap', 'filter', 'sideEffect', 'branch'
      ],

      typeKeywords: [
        'boolean', 'double', 'byte', 'int', 'short', 'char', 'void', 'long', 'float'
      ],

      operators: [
        '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
        '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
        '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
        '%=', '<<=', '>>=', '>>>='
      ],
    
      // we include these common regular expressions
      symbols:  /[=><!~?:&|+\-*\/\^%]+/,
    
      // C# style strings
      escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    

      tokenizer: {
        root: [
          [/[a-z_$][\w$]*/, { 
            cases: { 
              '@typeKeywords': 'keyword',
              '@keywords': 'keyword',
              '@default': 'identifier' 
            } 
          }],
                                   
          [/[A-Z][\w\$]*/, 'type.identifier' ],  // to show class names nicely

          // whitespace
          { include: '@whitespace' },

          // delimiters and operators
          [/[{}()\[\]]/, '@brackets'],
          [/[<>](?!@symbols)/, '@brackets'],
          [/@symbols/, { cases: { '@operators': 'operator',
                                  '@default'  : '' } } ],

          // @ annotations.
          // As an example, we emit a debugging log message on these tokens.
          // Note: message are supressed during the first load -- change some lines to see them.
          [/@\s*[a-zA-Z_\$][\w\$]*/, { token: 'annotation', log: 'annotation token: $0' }],

          // numbers
          [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
          [/0[xX][0-9a-fA-F]+/, 'number.hex'],
          [/\d+/, 'number'],

          // delimiter: after number because of .\d floats
          [/[;,.]/, 'delimiter'],

          // strings
          [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
          [/"/,  { token: 'string.quote', bracket: '@open', next: '@string' } ],

          // characters
          [/'[^\\']'/, 'string'],
          [/(')(@escapes)(')/, ['string','string.escape','string']],
          [/'/, 'string.invalid']
        ],
        comment: [
          [/[^\/*]+/, 'comment' ],
          [/\/\*/,    'comment', '@push' ],    // nested comment
          ["\\*/",    'comment', '@pop'  ],
          [/[\/*]/,   'comment' ]
        ],
    
        string: [
          [/[^\\"]+/,  'string'],
          [/@escapes/, 'string.escape'],
          [/\\./,      'string.escape.invalid'],
          [/"/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
        ],
    
        whitespace: [
          [/[ \t\r\n]+/, 'white'],
          [/\/\*/,       'comment', '@comment' ],
          [/\/\/.*$/,    'comment'],
        ],
      }
    });

    (<any>window).monaco.editor.defineTheme('myCoolTheme', {
      base: 'vs',
      inherit: false,
      rules: [
        // { token: 'keyword', foreground: '8082d9', fontStyle: 'bold' },
        // { token: 'identifier', foreground: '3681eb' },
        // { token: 'comment', foreground: '00FF00' },
        // { token: 'operator', foreground: '00FF00' },
        // { token: '', foreground: 'efff12' }

        { token: 'comment', foreground: 'aaaaaa', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ce63eb' },
        { token: 'operator', foreground: '000000' },
        { token: 'namespace', foreground: '66afce' },

        { token: 'type', foreground: '1db010' },
        { token: 'struct', foreground: '0000ff' },
        { token: 'class', foreground: '0000ff', fontStyle: 'bold' },
        { token: 'interface', foreground: '007700', fontStyle: 'bold' },
        { token: 'enum', foreground: '0077ff', fontStyle: 'bold' },
        { token: 'typeParameter', foreground: '1db010' },
        { token: 'function', foreground: '94763a' },

        { token: 'member', foreground: '94763a' },
        { token: 'macro', foreground: '615a60' },
        { token: 'variable', foreground: '3e5bbf' },
        { token: 'parameter', foreground: '3e5bbf' },
        { token: 'property', foreground: '3e5bbf' },
        { token: 'label', foreground: '615a60' },

        { token: 'type.static', fontStyle: 'bold' },
        { token: 'class.static', foreground: 'ff0000', fontStyle: 'bold' }
      ],
      colors: {
        'editor.foreground': '#000000',
        'editor.background': '#87CEEB',
        'editorCursor.foreground': '#8B0000',
        'editor.lineHighlightBackground': '#0000FF20',
        'editorLineNumber.foreground': '#008800',
        'editor.selectionBackground': '#88000030',
        'editor.inactiveSelectionBackground': '#88000015'
    }
    });
  }
};


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MonacoEditorModule.forRoot(monacoConfig) // use forRoot() in main app module only.
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
