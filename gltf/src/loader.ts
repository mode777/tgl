import { GlTf } from './gltf';

export async function loadGltf(url: string) {
    const response = await fetch(url);
    return <GlTf> await response.json()
}