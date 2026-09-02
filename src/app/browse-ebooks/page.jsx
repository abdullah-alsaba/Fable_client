import BookCard from '@/Components/BookCard/BookCard';
import BrowseEbooksSidebar from '@/Components/BrowseEbooksSidebar/BrowseEbooksSidebar';
import { getDataAllEBooks } from '@/utils/data';
import React from 'react';

const BrowseBooks =async () => {
    const eBooks = await getDataAllEBooks()
    return (
      <div>
        <div>
          <h1>Explore Ebooks</h1>
          <p>
            Discover your next compelling read. Our curated collection spans
            genres, carefully selected for the discerning reader.
          </p>
            <input type="text" className='bg-white' />
            </div>
            <div className='flex'>
                <BrowseEbooksSidebar />
                <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6'>
                    {eBooks.map((book) => <BookCard key={book._id} book={book } />)}
                </div>
                
            </div>
        </div>
        
    );
};

export default BrowseBooks;