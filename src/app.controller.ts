import { Controller, Delete, Get, Param, Render, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Quote, QuoteList } from './quote';
import { quotes } from './quotes';
import { get } from 'http';

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }
  @Get('/quotes')
  @Render('quotes')
  getAllQuotes(@Query('text') text: string) {
    let foundQuotes = [];
    quotes.quotes.forEach(q => {
      if (q.quote.toLowerCase().includes(text)) {
        foundQuotes.push(q)
      }
    });
    if (!text) return { quotes: quotes.quotes }
    return { quotes: foundQuotes }
  }
  @Get('/randomQuote')
  @Render('oneQuote')
  getRandomQuote() {
    const index = randomInteger(0, quotes.quotes.length - 1)
    return {
      quote: quotes.quotes[index]
    }
  }
  @Get('/topAuthors')
  @Render('topAuthors')
  getTopAuthors() {
    const quoteMap = new Map<string, number>();
    quotes.quotes.forEach(q => {
      let prevValue
      if (quoteMap.get(q.author)) {
        prevValue = quoteMap.get(q.author).valueOf()
      }
      else {
        prevValue = 0
      }

      quoteMap.set(q.author, prevValue + 1)
      console.log(quoteMap)
    });
    return { map: quoteMap }
  }
  @Get('quotes/:id')
  @Render('oneQuote')
  quoteById(@Param('id') quoteId: number) {
    let foundQuote;
    quotes.quotes.forEach(q => {
      if (q.id == quoteId) {
        foundQuote = q
      }
    });

    return {
      quote: foundQuote
    }
  }
  @Get('delete/:id')
  @Render('index')
  deleteQuote(@Param('id') quoteId: number) {
    let foundQuote;
    quotes.quotes.forEach(q => {
      if (q.id == quoteId) {
        foundQuote = q
      }
    })
    if (!foundQuote) {
      return {
        message: "Nincs ilyen id"
      }
    }
    return {
      message: "Törölve"
    }
  }
  @Get('authorRandom')
  @Render('authorRandomForm')
  getRandomAuthor(@Query('author') author: string) {
    let foundQuotes = [];
    quotes.quotes.forEach(q => {
      if (q.author.toLowerCase().includes(author)) {
        foundQuotes.push(q)
      }
    });
    let quote = foundQuotes[randomInteger(0, foundQuotes.length - 1)]
    return { quote: quote }
  }
  @Get('highlight/:id')
  @Render('highlight')
  getHighlight(@Param('id') id: number, @Query('text') text:string) {
    let fquote;
    quotes.quotes.forEach(q => {
      if (q.id == id) {
        fquote = q
      }
    });
    let quotep1 = fquote.quote.split(text)[0]
    let quotep2 = fquote.quote.split(text)[1]
    return { quotep1, highlighted: text, quotep2, author: fquote.author }
  }
}
