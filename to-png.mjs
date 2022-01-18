import sharp from 'sharp';

const [, , filename = 'test'] = process.argv;

sharp(`${filename}.svg`)
    .resize({
        fit: 'cover',
        height: 2160,
        width: 3840,
        withoutEnlargement: true,
    })
    .png()
    .toFile(`${filename}.png`);
