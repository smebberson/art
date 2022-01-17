import sharp from 'sharp';

sharp('test.svg')
    .resize({
        fit: 'cover',
        height: 2160,
        width: 3840,
        withoutEnlargement: true,
    })
    .png()
    .toFile('test.png');
