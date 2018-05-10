import './test/drawable.spec.ts';
import './test/framebuffer.spec.ts';
import './test/renderer.spec.ts';
import './test/shader.spec.ts';
import './test/texture.spec.ts';
import './test/vertex-buffer.spec.ts';
import { getTests } from 'test';
import Reporter from './src/reporter';
new Reporter(getTests()).run();