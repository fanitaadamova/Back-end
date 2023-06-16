const Photo = require('../models/Photo');

exports.getAllPhotos = () => Photo.find().populate('owner');

exports.getPhotoById = (photoId) => Photo.findById(photoId).populate('owner');

exports.updatePhoto = (photoId, data) => Photo.findByIdAndUpdate(photoId, data);

exports.deletePhoto = (photoId) => Photo.findByIdAndDelete(photoId);

exports.createPhoto = async (photoData) => {
    const photo = new Photo(photoData);
    await photo.save();

    return photo;
};

exports.addComment = async (photoId, commentData) => {
    const photo = await Photo.findById(photoId);
    //push comment in document, after that save 
    photo.comments.push(commentData);

    return photo.save();
}

exports.getPhotosbyOwner = (userId) => Photo.find({ owner: userId });





