import './test/geometry.spec.ts';
import './test/gl-context.spec.ts';
import './test/index-buffer.spec.ts';
import './test/shader.spec.ts';
import './test/vertex-buffer.spec.ts';
import { getTests } from 'test';
import Reporter from './src/reporter';
new Reporter(getTests()).run();