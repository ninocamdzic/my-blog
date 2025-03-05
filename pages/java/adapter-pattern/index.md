# The Adapter Pattern
<sup>Published on: %{date-published}%</sup>

The adapter pattern promotes decoupling by abstracting away how classes work together.

## Example

We want to retrieve stored images through our service and output them to the HttpServletResponse.getOutputStream in our controller.

```java
@RestController
@RequestMapping("/image")
public class ImagesController {
    @GetMapping(value = "/image/{id}", produces = MediaType.IMAGE_PNG_VALUE)
    public void fetchImage(@PathVariable String id, HttpServletResponse response) {
        this.imageService.fetch(id, new HttpOutputAdapter(response));
    }
}

@Service
public class ImageService {
  public void fetch(String id, IOutputAdapter outputAdapter) {
    try {
      try (OutputStream out = outputAdapter.getOutputStream();
           InputStream in = imageRepo.fetch(id).getInputStream()) {
        byte[] buffer = new byte[1024];
        int readLen = 0;

        while ((readLen = in.read(buffer)) != -1) {
          out.write(buffer, 0, readLen);
        }
      }
    } catch (IOException e) {
      throw new ServiceException(String.format("Failed to retrieve the image with id %s.", id), e);
    }
  }
}

```

This is what the adapter looks like:

```java
public interface IOutputAdapter {
  OutputStream getOutputStream() throws IOException;
}

public class HttpOutputAdapter implements IOutputAdapter {
  private final HttpServletResponse response;

  private HttpOutputAdapter(HttpServletResponse response) {
    this.response = response;
  }

  @Override
  public OutputStream getOutputStream() throws IOException {
    return response.getOutputStream();
  }
}
```