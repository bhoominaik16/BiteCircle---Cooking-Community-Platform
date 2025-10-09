const RecipeCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse w-80"> {/* Added fixed width */}
            {/* Image placeholder */}
            <div className="h-48 bg-gray-300 w-full"></div>
            
            {/* Content area */}
            <div className="p-6"> {/* Increased padding to match RecipeCard */}
                {/* Title placeholder */}
                <div className="h-7 bg-gray-300 rounded-md w-4/5 mb-3"></div>
                
                {/* Author placeholder */}
                <div className="h-5 bg-gray-300 rounded-md w-2/5 mb-4"></div>
                
                {/* Cook time info placeholder */}
                <div className="flex items-center justify-between mb-4">
                    <div className="h-5 bg-gray-300 rounded-md w-1/3"></div>
                    <div className="h-5 bg-gray-300 rounded-md w-1/4"></div>
                </div>
                
                {/* Tags placeholder */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                    <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-300 rounded-full w-24"></div>
                </div>
                
                {/* Rating and button placeholder */}
                <div className="flex items-center justify-between">
                    <div className="h-5 bg-gray-300 rounded-md w-16"></div>
                    <div className="h-10 bg-gray-300 rounded-lg w-32"></div>
                </div>
            </div>
        </div>
    );
};

export default RecipeCardSkeleton;