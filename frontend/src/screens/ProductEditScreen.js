import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

const ProductEditScreen = ({ history, match }) => {
    const productId = match.params.id
    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails;

    const productUpdate = useSelector(state => state.productUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

    const [image, setImage] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0);
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (successUpdate) {
            dispatch({
                type: PRODUCT_UPDATE_RESET
            })
            history.push('/admin/productlist')
        } else {
            if (!product.name || product._id !== productId) {
                dispatch(listProductDetails(productId));
            }
            else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
            }
        }
    }, [product, productId, dispatch, history, successUpdate])

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        console.log(file);
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            console.log(formData);
            const { data } = await axios.post('/api/upload', formData, config);

            setImage(data);
            setUploading(false)
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProduct({
            _id: productId,
            name, brand, price, image, category, description, countInStock
        }))
    }

    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>Go Back</Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
                {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='email'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Name" value={name} onChange={e => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='price'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" placeholder="Enter Price" value={price} onChange={e => setPrice(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='image'>
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="text" placeholder="Enter Image Url" value={image} onChange={e => setImage(e.target.value)} />
                            <Form.File id="image-file" label="Choose File" custom onChange={uploadFileHandler}></Form.File>
                            {uploading && <Loader />}
                        </Form.Group>
                        <Form.Group controlId='Brand'>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control type="text" placeholder="Enter Brand Name" value={brand} onChange={e => setBrand(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='CountInStock'>
                            <Form.Label>Count In Stock</Form.Label>
                            <Form.Control type="number" placeholder="Enter Count In Stock" value={countInStock} onChange={e => setCountInStock(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='Category'>
                            <Form.Label>Category</Form.Label>
                            <Form.Control type="text" placeholder="Enter Category Name" value={category} onChange={e => setCategory(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='Description'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter Description" value={description} onChange={e => setDescription(e.target.value)} />
                        </Form.Group>
                        <Button type="submit" variant="primary">Update</Button>
                    </Form>
                )}
            </FormContainer>
        </>
    )
}

export default ProductEditScreen
