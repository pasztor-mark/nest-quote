import { Controller, Get, Render, Res } from '@nestjs/common';
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
  getQuoteList(): any {

    return {
      quotes: quotes.quotes,
    }
  }
  @Get('/randomQuote')
  @Render('randomQuote')
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
      
      quoteMap.set(q.author, prevValue+1)
      console.log(quoteMap)
    });
    return {map: quoteMap}
  }
}
