import React from 'react'
import Skeletons from '../../custom/components/Skeletons'

function SearchSkeleton() {
    return (
        <div className="searchSkeletonBody">
            {[...Array(6)].map((data, index) => (
                <div key={index}>
                    <Skeletons type="gridImage" />
                    <Skeletons type="title" />
                    <Skeletons type="text" />
                    <Skeletons type="text" />
                    <Skeletons type="actionButton" />
                </div>
            ))}
        </div>
    )
}

export default SearchSkeleton
