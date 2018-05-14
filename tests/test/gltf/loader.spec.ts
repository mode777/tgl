import { describe, it, expect } from "test";
import { loadGltf } from '@tgl/gltf';

describe("Gltf.Loader", () => {
    
    it('should load file', async () => {
        const gltf = await loadGltf('./../assets/gltf/minimal.json');
        expect(gltf.asset.version).toBe('2.0');
    });
    
});