import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { createProduct, updateProduct } from '../utils/data/productData';
import { useAuth } from '../utils/context/authContext';
import getAllGenres from '../utils/data/genreData';

const initialState = {
  title: '',
  sellerId: 0,
  genreId: 0,
  description: '',
  qtyAvailable: 0,
  price: 0,
};

const ProductForm = ({ obj }) => {
  const { user } = useAuth();

  const [genres, setGenres] = useState([]);
  const [currentRecord, setCurrentRecord] = useState({
  });

  const router = useRouter();

  useEffect(() => {
    if (obj.id) {
      setCurrentRecord({
        id: obj.id,
        sellerId: user.id,
        genreId: obj.genre_id,
        title: obj.title,
        description: obj.description,
        qtyAvailable: obj.qty_available,
        price: obj.price,
        addedOn: obj.added_on,
      });
    }
  }, [obj, user]);

  useEffect(() => {
    getAllGenres().then(setGenres);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCurrentRecord((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (obj.id) {
      const recordUpdate = {
        id: currentRecord.id,
        sellerId: user.id,
        genreId: currentRecord.genreId,
        title: currentRecord.title,
        description: currentRecord.description,
        qtyAvailable: currentRecord.qtyAvailable,
        price: currentRecord.price,
        addedOn: currentRecord.addedOn,
      };

      updateProduct(recordUpdate)
        .then(() => router.push(`/products/${currentRecord.id}`));
    } else {
      const record = {
        id: currentRecord.id,
        sellerId: user.id,
        genreId: currentRecord.genreId,
        title: currentRecord.title,
        description: currentRecord.description,
        qtyAvailable: currentRecord.qtyAvailable,
        price: currentRecord.price,
        addedOn: currentRecord.addedOn,
      };
      createProduct(record)
        .then((newRecord) => router.push(`/products/${newRecord.id}`));
      // createProduct(currentRecord)
      //   .then((product) => router.push(`/products/${product.id}`));
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3">
          <Form.Label>Title (Artist Name, Album Name)</Form.Label>
          <Form.Control name="title" required value={currentRecord.title} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control name="description" required value={currentRecord.description} onChange={handleChange} />
        </Form.Group>

        <Form.Label>Genre</Form.Label>
        <Form.Select
          aria-label="genreId"
          name="genreId"
          onChange={handleChange}
          value={currentRecord.genreId}
        >
          <option value="">Pick a Genre</option>
          {
                  genres.map((genre) => (
                    <option
                      key={genre.id}
                      value={genre.id}
                    >
                      {genre.description}
                    </option>
                  ))
                }
        </Form.Select>

        <br />

        <Form.Group className="mb-3">
          <Form.Label>Qty Available</Form.Label>
          <Form.Control type="number" step="1" name="qtyAvailable" required value={currentRecord.qtyAvailable} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control type="number" step="1" name="price" required value={currentRecord.price} onChange={handleChange} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

ProductForm.propTypes = {
  obj: PropTypes.shape({
    id: PropTypes.number,
    seller_id: PropTypes.number,
    genre_id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    qty_available: PropTypes.number,
    price: PropTypes.number,
    added_on: PropTypes.string,
  }),
};

ProductForm.defaultProps = {
  obj: initialState,
};

export default ProductForm;
