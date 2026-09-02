import React from 'react';

const BrowseEbooksSidebar = () => {
    return (
      <div>
        <div>
                <h1>Genre</h1>
                <label htmlFor="fiction"></label>
          <input type="radio" name="Fiction" id="Fiction" />
          <input type="radio" name="Mystery" id="Mystery" />
          <input type="radio" name="Romance" id="Romance" />
          <input type="radio" name="Sci-Fi" id="Sci-Fi" />
          <input type="radio" name="Fantasy" id="Fantasy" />
          <input type="radio" name="Biography" id="Biography" />
        </div>
      </div>
    );
};

export default BrowseEbooksSidebar;