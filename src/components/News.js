import React, {useEffect, useState} from 'react'

import NewsItem from './NewsItem'
import Spinner from './Spinner';
// import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
//   console.log(props.apiKey)
    const updateNews = async () => {
        try {
            props.setProgress(10);
            const url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=${props.country}&max=10&apikey=${props.apiKey}`;
            setLoading(true);
            let data = await fetch(url);
            props.setProgress(30);

            if (!data.ok) throw new Error("Failed to fetch news");

            let parsedData = await data.json();
            // console.log(parsedData);
            props.setProgress(70);

            setArticles(parsedData.articles || []); // Default to empty array
            setTotalResults(parsedData.totalResults || 0);
            setLoading(false);
            props.setProgress(100);
        } catch (error) {
            console.error("Error fetching news:", error);
            setArticles([]); // Ensure articles remains an array
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
        updateNews();
        // eslint-disable-next-line
    }, []);

    const fetchMoreData = async () => {
        try {
            const url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&country=${props.country}&apikey=${props.apiKey}`;
            setPage(page + 1);
            let data = await fetch(url);

            if (!data.ok) throw new Error("Failed to fetch more news");

            let parsedData = await data.json();
            setArticles(articles.concat(parsedData.articles || []));
            setTotalResults(parsedData.totalResults || 0);
        } catch (error) {
            console.error("Error fetching more news:", error);
        }
    };

    return (
        <>
            <h1 className="text-center" style={{ margin: "35px 0px", marginTop: "90px" }}>
                NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
            </h1>
            {loading && <Spinner />}
            <InfiniteScroll
                dataLength={articles?.length || 0} // Safeguard against undefined
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
                loader={<Spinner />}
            >
                <div className="container">
                    <div className="row">
                        {articles.map((element,index) => {
                            // console.log(element)
                            return (
                                <div className="col-md-4" key={index}>
                                    <NewsItem
                                        title={element.title || ""}
                                        description={element.description || ""}
                                        imageUrl={element.image}
                                        newsUrl={element.url}
                                        author={element.author}
                                        date={element.publishedAt}
                                        source={element.source.name}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    );
};


export default News;
