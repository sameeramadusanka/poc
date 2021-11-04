import { Component } from '@angular/core';
import { NgxEditorModel } from 'ngx-monaco-editor';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  monacod = (<any>window).monaco;
  suggestionSet:any[]=[];
  
  constructor(private http: HttpClient) {
    this.getJSON().subscribe(data => {
        this.suggestionSet = data;
    });
    
  }

  options = {
    theme: 'myCoolTheme',
    fontFamily: "Courier",
    fontSize: 12
  };

  model: NgxEditorModel = {
    value: "",
    language: 'mySpecialLanguage'
  };

  public getJSON(): Observable<any> {
    return this.http.get("../assets/wordset.json");
  }

  onInit(editor:any) {

    const monaco = (<any>window).monaco;
    const CompletionItemKindList=[
      {"label":"Class", "value":(<any>window).monaco.languages.CompletionItemKind.Class},
      {"label":"Color", "value":(<any>window).monaco.languages.CompletionItemKind.Color},
      {"label":"Constant", "value":(<any>window).monaco.languages.CompletionItemKind.Constant},
      {"label":"Constructor", "value":(<any>window).monaco.languages.CompletionItemKind.Constructor},
      {"label":"Customcolor", "value":(<any>window).monaco.languages.CompletionItemKind.Customcolor},
      {"label":"Enum", "value":(<any>window).monaco.languages.CompletionItemKind.Enum},
      {"label":"EnumMember", "value":(<any>window).monaco.languages.CompletionItemKind.EnumMember},
      {"label":"Event", "value":(<any>window).monaco.languages.CompletionItemKind.Event},
      {"label":"Field", "value":(<any>window).monaco.languages.CompletionItemKind.Field},
      {"label":"File", "value":(<any>window).monaco.languages.CompletionItemKind.File},
      {"label":"Folder", "value":(<any>window).monaco.languages.CompletionItemKind.Folder},
      {"label":"Function", "value":(<any>window).monaco.languages.CompletionItemKind.Function},
      {"label":"Interface", "value":(<any>window).monaco.languages.CompletionItemKind.Interface},
      {"label":"Issue", "value":(<any>window).monaco.languages.CompletionItemKind.Issue},
      {"label":"Keyword", "value":(<any>window).monaco.languages.CompletionItemKind.Keyword},
      {"label":"Method", "value":(<any>window).monaco.languages.CompletionItemKind.Method},
      {"label":"Module", "value":(<any>window).monaco.languages.CompletionItemKind.Module},
      {"label":"Operator", "value":(<any>window).monaco.languages.CompletionItemKind.Operator},
      {"label":"Property", "value":(<any>window).monaco.languages.CompletionItemKind.Property},
      {"label":"Reference", "value":(<any>window).monaco.languages.CompletionItemKind.Reference},
      {"label":"Snippet", "value":(<any>window).monaco.languages.CompletionItemKind.Snippet},
      {"label":"Struct", "value":(<any>window).monaco.languages.CompletionItemKind.Struct},
      {"label":"Text", "value":(<any>window).monaco.languages.CompletionItemKind.Text},
      {"label":"Unit", "value":(<any>window).monaco.languages.CompletionItemKind.Unit},
      {"label":"User", "value":(<any>window).monaco.languages.CompletionItemKind.User},
      {"label":"value", "value":(<any>window).monaco.languages.CompletionItemKind.value},
      {"label":"Variable", "value":(<any>window).monaco.languages.CompletionItemKind.Variable}
    ];
    
    this.suggestionSet.forEach((ele,ind)=>{
      CompletionItemKindList.forEach(ele1=>{
        if(ele.itemkind == ele1.label){
          this.suggestionSet[ind].kind = ele1.value;
        }
      });
    });
    
    const wordSet = this.suggestionSet;
    
    monaco.languages.registerHoverProvider('mySpecialLanguage', {
      provideHover: function (model:any, position:any) {
        if(model.getWordAtPosition(position)!= null){
          var result = wordSet.find(obj => {
            return obj.insertText === model.getWordAtPosition(position).word || obj.label === model.getWordAtPosition(position).word;
          })
          return {
            
            contents: [
              { value: model.getWordAtPosition(position).word },
              { value: result?result.documentation:"" }
            ]
          }
        }
        else{
          return;
        }
          
      }
    });


    monaco.languages.registerCompletionItemProvider('mySpecialLanguage', {
      provideCompletionItems: function(model:any, position:any) {
          var word = model.getWordUntilPosition(position);
          var range = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn
          };

          wordSet.forEach(word=>{
            word.range = range;
          });
          return {
              
              suggestions: wordSet
          };
      }
  });

  }
  
}
