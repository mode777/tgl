# WebGLRenderingContext method mapping

## State modification

Function|Action|Property|Description
-|-|-|-
activeTexture()|Set|activeTexture|Sets active texture
bindBuffer()|Set|vertexBuffer, indexBuffer|Sets the active vertex or index buffer
bindFramebuffer()|Set|framebuffer|Sets the active framebuffer
bindRenderbuffer()|Set|renderbuffer|Sets the active renderbuffer
bindTexture()|Set|texture|Binds texture to current activeTexture slot
blendColor()|Set|blendColor|Sets blend color
blendEquationSeparate()|Set|blendEquationAlpha, blendEquationRgb|Set current blend equation
blendEquation()|-|-|-
blendFunc()|-|-|-
blendFuncSeparate()|Set|blendFuncAlpha, blendFuncRgb|Sets current blend func
clearColor()|Set|clearColor|Sets current clear color
clearDepth()|Set|clearDepth|Sets current clear depth
clearStencil()|Set|clearStencil|Sets current clear stencil
colorMask()|Set|colorMask|Sets current color mask
cullFace()|Set|cullFaceMode|Set current face culing
depthFunc()|-|-|-
depthMask()|-|-|-
depthRange()|-|-|-
disable()|Set|depthTestEnabled, blendingEnabled,  faceCullingEnabled, polygonOffsetFillEnabled, sampleAlphaToCoverageEnabled, sampleCoverageEnabled, scissorTestEnabled, stencilTestEnabled|Disables features
enable()|Set|depthTestEnabled, blendingEnabled, faceCullingEnabled, polygonOffsetFillEnabled, sampleAlphaToCoverageEnabled, sampleCoverageEnabled, scissorTestEnabled, stencilTestEnabled|Enable features
frontFace()|Set|-|specifies whether polygons are front- or back-facing by setting a winding orientation.
disableVertexAttribArray()|
enableVertexAttribArray()|
getParameter()|
isEnabled()|
hint()|
lineWidth()|
viewport()|
polygonOffset()|
sampleCoverage()|
scissor()|
stencilFuncSeparate()|
stencilFunc()|
stencilMask()|
stencilMaskSeparate()|
stencilOp()|
stencilOpSeparate()|
useProgram()|
vertexAttrib[1234]f[v]()|

## Methods

### RenderingContext
Function|Method|Description
-|-|-
clear()|clear|Clear the screen
drawArrays()|drawArrays|Draw vertex arrays
drawElements()|drawElements|Draw buffers
finish()|finish|Block execution until all previous commands are finished
flush()|flush|empties different buffer commands, causing all commands to be executed as quickly as possible.
getContextAttributes()|
getError()|
getExtension()|
getSupportedExtensions()|
isContextLost()|

### Program
Function|Method|Description
-|-|-
createProgram()|constructor|Creates a program
bindAttribLocation()|bindAttribLocation|Bind vertex index to attribute
attachShader()|-|-|-
detachShader()|-|-|-
getActiveAttrib()|activeAttrib|Gets active attribute
getActiveUniform()|activeUniform|Gets active uniform
getAttachedShaders()|attachedShaders|Gets attached shaders
getAttribLocation()|getAttribuLocation|Gets attribute location
getProgramInfoLog()|
getProgramParameter()|
getUniform()|
getUniformLocation()|
linkProgram()|
uniform[1234][fi][v]()|
uniformMatrix[234]fv()|
validateProgram()|
deleteProgram()|delete|Deletes a program


### Shader
Function|Method|Description
-|-|-
createShader()|constructor|Creates a shader
compileShader()|compile|Compiles a shader
getShaderInfoLog()|
getShaderParameter()|
getShaderPrecisionFormat()|
getShaderSource()|
shaderSource()|
deleteShader()|delete|Deletes a shader

### Buffer
Function|Method|Description
-|-|-
createBuffer()|constructor|Creates a buffer
bufferData()|data|Create buffer data store
bufferSubData()|subData|Updates a subset of a buffer object's data store
getBufferParameter()|
deleteBuffer()|delete|Deletes a buffer
getVertexAttrib()|
getVertexAttribOffset()|
vertexAttribPointer()|

### Framebuffer
Function|Method|Description
-|-|-
createFramebuffer()|constructor|Creates a framebuffer
checkFramebufferStatus()|checkStatus|Returns the completeness status of the WebGLFramebuffer object
copyTexImage2D()|-|Copies pixels from the Framebuffer to a texture
copyTexSubImage2D()|-|Copies pixels from the Framebuffer to an existing texture
framebufferRenderbuffer()|renderbuffer|Attach a Renderbuffer to a framebuffer
framebufferTexture2D()|texture2d|Attach a Texture2d to a Framebuffer
getFramebufferAttachmentParameter()|
readPixels()|
deleteFramebuffer()|delete|Deletes a framebuffer

### Renderbuffer
Function|Method|Description
-|-|-
renderbufferStorage()|
createRenderbuffer()|constructor|Creates a renderbuffer
deleteRenderbuffer()|delete|Deletes a renderbuffer
getRenderbufferParameter()|

### Texture
Function|Method|Description
-|-|-
createTexture()|constructor|Creates a texture
compressedTexImage2D()|-|Extension
compressedTexSubImage2D()|-|Extension
generateMipmap()|generateMipmap|Creates mipmaps
deleteTexture()|delete|Deletes texture
getTexParameter()|
pixelStorei()|
texImage2D()|-|specifies a two-dimensional texture image.
texSubImage2D()|
texParameter[fi]()|


