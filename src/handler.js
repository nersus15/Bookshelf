const books = require("./books");
const InvalidInput = require("./inputError");
const {nanoid} = require('nanoid')

const addBooks = (req, h) => {
    const _posts = req.payload;
    const responseJson = {};
    let statusCode = 201;


    const validate = {
        name: [
            {
                rule: 'required',
                message: 'Gagal menambahkan buku. Mohon isi nama buku'
            }
        ],
        year:  [
            {
                rule: 'required',
                message: 'Gagal menambahkan buku. Mohon isi tahun terbit buku'
            }
        ],
        author:  [
            {
                rule: 'required',
                message: 'Gagal menambahkan buku. Mohon author buku'
            }
        ],
        summary:  [
            {
                rule: 'required',
                message: 'Gagal menambahkan buku. Mohon isi summary buku'
            }
        ],
        publisher:  [
            {
                rule: 'required',
                message: 'Gagal menambahkan buku. Mohon isi penerbit buku'
            }
        ],
        pageCount:  [
            {
                rule: 'required',
                message: 'Gagal menambahkan buku. Mohon isi jumlah halaman buku'
            }
        ],
        reading:  [
            {
                rule: 'required',
                message: 'Gagal menambahkan buku. Mohon isi status membaca/tidak'
            }
        ],
        readPage: [
            {
                rule: 'max',
                max: _posts['pageCount'],
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
            }
        ]
    };

    try{
        validator(_posts, validate);

        const bookid = nanoid(16);
        const finished = _posts['pageCount'] == _posts['readPage'];
        const dibuat = new Date().toISOString();

        books.push({..._posts, id: bookid, finished: finished, insertedAt: dibuat, updatedAt: dibuat});
        responseJson.status = "success";
        responseJson.message = "Buku berhasil ditambahkan";
        responseJson.data = {
            bookId: bookid
        }

    }catch(err){
        console.log(err.message);
        if(err.name == 'InvalidInput'){
            statusCode = 400;
            responseJson.status = 'fail';
            responseJson.message = err.message;
        }else{
            statusCode = 500;
            responseJson.status = 'error';
            responseJson.message = err.message;
        }
    }

    const response = h.response(responseJson).type('application/json');
    response.statusCode = statusCode;
    return response;
};

const getBooks = (req, h) => {
    
    let filtered = books;
    for(keyword in req.query){
        let type = 'equal';
        if(keyword == 'name')
            type = 'contain';

        filtered = search(filtered, keyword, req.query[keyword], type);
    }
    const returnBooks = filtered.map(({id, name, publisher}) => {
        return {id, name, publisher}
    });

    return {status: 'success', data:{books: returnBooks}}
};
const getBookById = (req, h) => {
    const {id} = req.params;
    const responseJson = {};
    let statusCode = 200;
    if(!id){
        responseJson.status  = 'fail',
        responseJson.message = 'Id Buku harap dimasukkan';
        statusCode = 400;
        const response = h.response(responseJson).type('application/json');
        response.statusCode = statusCode;
        return response;
    }
    const index = books.findIndex(book => book.id == id)

    if(index == -1){
        responseJson.status  = 'fail',
        responseJson.message = 'Buku tidak ditemukan';
        statusCode = 404
    }else{
        responseJson.status  = 'success',
        responseJson.data = {book: books[index]};
    }


    const response = h.response(responseJson).type('application/json');
    response.statusCode = statusCode;
    return response;

    
};
const updateBook = (req, h) => {
    const _posts = req.payload
    const {id} = req.params;
    const responseJson = {};
      const validate = {
        name: [
            {
                rule: 'required',
                message: 'Gagal memperbarui buku. Mohon isi nama buku'
            }
        ],
        year:  [
            {
                rule: 'required',
                message: 'Gagal memperbarui buku. Mohon isi tahun terbit buku'
            }
        ],
        author:  [
            {
                rule: 'required',
                message: 'Gagal memperbarui buku. Mohon author buku'
            }
        ],
        summary:  [
            {
                rule: 'required',
                message: 'Gagal memperbarui buku. Mohon isi summary buku'
            }
        ],
        publisher:  [
            {
                rule: 'required',
                message: 'Gagal memperbarui buku. Mohon isi penerbit buku'
            }
        ],
        pageCount:  [
            {
                rule: 'required',
                message: 'Gagal memperbarui buku. Mohon isi jumlah halaman buku'
            }
        ],
        reading:  [
            {
                rule: 'required',
                message: 'Gagal memperbarui buku. Mohon isi status membaca/tidak'
            }
        ],
        readPage: [
            {
                rule: 'max',
                max: _posts['pageCount'],
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            }
        ]
    };
    let statusCode = 200;
    if(!id){
        responseJson.status  = 'fail',
        responseJson.message = 'Gagal memperbarui buku. Id tidak ditemukan';
        statusCode = 400
    }
    const index = books.findIndex(book => book.id == id)

    if(index == -1){
        responseJson.status  = 'fail',
        responseJson.message = 'Gagal memperbarui buku. Id tidak ditemukan';
        statusCode = 404;
        const response = h.response(responseJson).type('application/json');
        response.statusCode = statusCode;
        return response;
    }else{
        try{
            validator(_posts, validate);
            const finished = _posts['pageCount'] == _posts['readPage'];
            const dibuat = new Date().toISOString();
    
            const currBook = books[index];

            books.splice(index, 1, {...currBook, ..._posts, finished: finished, updatedAt: dibuat});
            responseJson.status = "success";
            responseJson.message = "Buku berhasil diperbarui";
    
    
        }catch(err){
            console.log(err.message);
            if(err.name == 'InvalidInput'){
                statusCode = 400;
                responseJson.status = 'fail';
                responseJson.message = err.message;
            }else{
                statusCode = 500;
                responseJson.status = 'error';
                responseJson.message = err.message;
            }
        }
    }

   

    const response = h.response(responseJson).type('application/json');
    response.statusCode = statusCode;
    return response;

};
const deleteBook = (req, h) => {
    const {id} = req.params;

    const responseJson = {};
    let statusCode = 200;

    if(!id){
        responseJson.status  = 'fail',
        responseJson.message = 'Gagal memperbarui buku. Id tidak ditemukan';
        statusCode = 400;
        const response = h.response(responseJson).type('application/json');
        response.statusCode = statusCode;
        return response;
        }
    const index = books.findIndex(book => book.id == id)

    if(index == -1){
        responseJson.status  = 'fail',
        responseJson.message = 'Buku gagal dihapus. Id tidak ditemukan';
        statusCode = 404
    }else{
        responseJson.status  = 'success',
        responseJson.data = {book: books[index]};

        try{    
            books.splice(index, 1);
            responseJson.status = "success";
            responseJson.message = "Buku berhasil dihapus";
    
        }catch(err){
            if(err.name == 'InvalidInput'){
                statusCode = 400;
                responseJson.status = 'fail';
                responseJson.message = err.message;
            }else{
                statusCode = 500;
                responseJson.status = 'error';
                responseJson.message = err.message;
            }

            const response = h.response(responseJson).type('application/json');
            response.statusCode = statusCode;
            return response;
        }
    
    }
    const response = h.response(responseJson).type('application/json');
    response.statusCode = statusCode;
    return response;  

};

const validator = (values, config) => {
    if(!values)
        throw new InvalidInput("Post Payload is empty");

    for(let input in config){
        const value = values[input];
        const matcher = config[input];

        matcher.forEach(object => {
            if(object.rule == 'regex'){
                
            }else if(object.rule == 'required'){
             if(value === undefined || value === '' || value === null)
                    throw new InvalidInput(object.message || `Input "${input}" required!`);
            }else if(object.rule === 'string'){
                if(typeof value !== 'string')
                    throw new InvalidInput(object.message || `Input "${input} harus berupa string`);
            }else if(object.rule === 'number'){
                if(!isNaN(value))
                    throw new InvalidInput(object.message || `Input "${input} harus berupa number`);
            }else if(object.rule === 'max'){
                if(!object.max)
                    throw new InvalidInput(`Invalid nilai maximum untuk ${input}`);
                if(value > object.max)
                    throw new InvalidInput(object.message || `Input "${input} tidak boleh lebih besar dari ${object.max}`);
            }else if(object.rule === 'min'){
                if(!object.min)
                    throw new InvalidInput(`Invalid nilai minimum untuk ${input}`);

                if(value < object.min)
                    throw new InvalidInput(object.message || `Input "${input} tidak boleh lebih kecil dari ${object.min}`);
            }else if(typeof object.rule === 'function'){
                object.rule(value, input, values);
            }
        })
    }
}

const search = (arr, key, val, type) => {
    return arr.filter((obj) => type == 'equal' ? obj[key] == val : obj[key].toLowerCase().includes(val.toLowerCase()));
}
module.exports = {addBooks, getBooks, getBookById, updateBook, deleteBook}