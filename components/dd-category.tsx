const Category = () => {
    return (

        <select className="block px-3 py-2 mb-6 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm w-full focus:outline-none focus:ring-primary-500 focus:border-primary-500" name="animals">
            <option value="">
             Category
            </option>
            <option value="dog">
                Dog
            </option>
            <option value="cat">
                Cat
            </option>
            <option value="hamster">
                Hamster
            </option>
            <option value="parrot">
                Parrot
            </option>
            <option value="spider">
                Spider
            </option>
            <option value="goldfish">
                Goldfish
            </option>
        </select>



    );
};

export default Category;
