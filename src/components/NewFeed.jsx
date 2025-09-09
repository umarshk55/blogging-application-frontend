// import React from 'react'
// import { useState } from 'react'
// import { useEffect } from 'react'
// import { loadAllPosts } from '../services/post-service'
// import { Row, Col, Pagination, PaginationItem, PaginationLink, Container } from 'reactstrap'
// import Post from './Post'
// import { toast } from 'react-toastify'
// import InfiniteScroll from 'react-infinite-scroll-component'
// import { deletePostService } from '../services/post-service'
// function NewFeed() {


//     const [postContent, setPostContent] = useState({
//         content: [],
//         totalPages: '',
//         totalElements: '',
//         pageSize: '',
//         lastPage: false,
//         pageNumber: ''

//     })

//     const [currentPage, setCurrentPage] = useState(0)

//     useEffect(() => {
//         console.log("loading posts")
//         console.log(currentPage)
//         changePage(currentPage)

//     }, [currentPage])


//     const changePage = (pageNumber = 0, pageSize = 5) => {
//         if (pageNumber > postContent.pageNumber && postContent.lastPage) {
//             return
//         }
//         if (pageNumber < postContent.pageNumber && postContent.pageNumber == 0) {
//             return
//         }
//         loadAllPosts(pageNumber, pageSize).then(data => {
//             setPostContent({
//                 content: [...postContent.content, ...data.content],
//                 totalPages: data.totalPages,
//                 totalElements: data.totalElements,
//                 pageSize: data.pageSize,
//                 lastPage: data.lastPage,
//                 pageNumber: data.pageNumber
//             })

//             console.log(data);

//         }).catch(error => {
//             toast.error("Error in loading posts")

//         })
//     }



//     function deletePost(post) {
//         //going to delete post
//         console.log(post)

//         deletePostService(post.postId).then(res => {
//             console.log(res)
//             toast.success("post is deleled..")

//             let newPostContents = postContent.content.filter(p => p.postId != post.postId)
//             setPostContent({ ...postContent, content: newPostContents })

//         })
//             .catch(error => {
//                 console.log(error)
//                 toast.error("error in deleting post")
//             })
//     }


//     const changePageInfinite = () => {
//         console.log("page chagned")
//         setCurrentPage(currentPage + 1)

//     }

//     return (
//         <div className="container-fluid">
//             <Row>
//                 <Col md={
//                     {
//                         size: 12

//                     }
//                 }>

//                     <h1>Blogs Count  ( {postContent?.totalElements} )</h1>
//                     <InfiniteScroll
//                         dataLength={postContent.content.length}
//                         next={changePageInfinite}
//                         hasMore={!postContent.lastPage}
//                         loader={<h4>Loading...</h4>}
//                         endMessage={
//                             <p style={{ textAlign: 'center' }}>
//                                 <b>Yay! You have seen it all</b>
//                             </p>
//                         }
//                     >
//                         {
//                             postContent.content.map((post, index) => (
//                                 <Post deletePost={deletePost} post={post} key={index} />
//                             ))
//                         }

//                     </InfiniteScroll>
//                     {/* <Container className='mt-3'>
//                         <Pagination size='lg'>
//                             <PaginationItem onClick={() => changePage(postContent.pageNumber-1)} disabled={postContent.pageNumber == 0}>
//                                 <PaginationLink previous>
//                                     Previous
//                                 </PaginationLink>
//                             </PaginationItem>

//                             {
//                                 [...Array(postContent.totalPages)].map((item, index) => (


//                                     <PaginationItem onClick={() => changePage(index)} active={index == postContent.pageNumber} key={index}>
//                                         <PaginationLink>

//                                             {index + 1}

//                                         </PaginationLink>
//                                     </PaginationItem>

//                                 ))
//                             }


//                             <PaginationItem onClick={() => changePage(postContent.pageNumber+1)} disabled={postContent.lastPage}>
//                                 <PaginationLink next>
//                                     Next
//                                 </PaginationLink>
//                             </PaginationItem>
//                         </Pagination>

//                     </Container> */}
//                 </Col>
//             </Row>
//         </div>


//     )
// }

// export default NewFeed

import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Input, InputGroup, InputGroupText } from 'reactstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { loadAllPosts, deletePostService } from '../services/post-service';
import Post from './Post';
import { toast } from 'react-toastify';

function NewFeed() {
  const [postContent, setPostContent] = useState({
    content: [],
    totalPages: '',
    totalElements: '',
    pageSize: '',
    lastPage: false,
    pageNumber: ''
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    changePage(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const changePage = (pageNumber = 0, pageSize = 5) => {
    if (pageNumber > postContent.pageNumber && postContent.lastPage) return;
    if (pageNumber < postContent.pageNumber && postContent.pageNumber === 0) return;

    loadAllPosts(pageNumber, pageSize)
      .then(data => {
        // ✅ Deduplicate posts by postId
        setPostContent(prev => {
          const merged = [...prev.content, ...data.content];
          const unique = merged.filter(
            (post, index, self) =>
              index === self.findIndex(p => p.postId === post.postId)
          );
          return {
            content: unique,
            totalPages: data.totalPages,
            totalElements: data.totalElements,
            pageSize: data.pageSize,
            lastPage: data.lastPage,
            pageNumber: data.pageNumber
          };
        });
      })
      .catch(() => toast.error("Error in loading posts"));
  };

  const changePageInfinite = () => setCurrentPage((p) => p + 1);

  function deletePost(post) {
    deletePostService(post.postId)
      .then(() => {
        toast.success("Post deleted");
        setPostContent(prev => ({
          ...prev,
          content: prev.content.filter(p => p.postId !== post.postId)
        }));
      })
      .catch(() => toast.error("Error deleting post"));
  }

  const filtered = query.trim()
    ? postContent.content.filter(p => {
        const hay =
          (p.title || "") + " " +
          (p.content || "").replace(/<[^>]+>/g, " ") + " " +
          (p?.category?.categoryTitle || "");
        return hay.toLowerCase().includes(query.toLowerCase());
      })
    : postContent.content;

  return (
    <div className="container-fluid">
      <Row>
        <Col md={{ size: 12 }}>
          <div className="d-flex align-items-center justify-content-between mt-3">
            <h1 className="m-0">Blogs ({postContent?.totalElements || 0})</h1>
            <Container className="p-0" style={{ maxWidth: 420 }}>
              <InputGroup>
                <InputGroupText>🔍</InputGroupText>
                <Input
                  placeholder="Search by title, content, category…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </InputGroup>
            </Container>
          </div>

          <InfiniteScroll
            dataLength={postContent.content.length}
            next={changePageInfinite}
            hasMore={!postContent.lastPage}
            loader={<h4>Loading...</h4>}
            endMessage={<p style={{ textAlign: 'center' }}><b>Yay! You have seen it all</b></p>}
          >
            {filtered.map((post, index) => (
              <Post 
                deletePost={deletePost} 
                post={post} 
                key={`${post.postId}-${index}`} // ✅ unique key
              />
            ))}
          </InfiniteScroll>
        </Col>
      </Row>
    </div>
  );
}

export default NewFeed;
