// ycdtool: converts CodeWalker-format clip dictionary XML into binary .ycd files and back.
//   ycdtool xml2ycd <in.ycd.xml> <out.ycd>
//   ycdtool ycd2xml <in.ycd> <out.ycd.xml>
//   ycdtool batch <xml-dir> <out-dir>        (every *.ycd.xml -> <name>.ycd)
// Exit code 0 on success, 1 on any error.
using System;
using System.Globalization;
using System.IO;
using System.Threading;
using CodeWalker.GameFiles;

internal static class Program
{
    private static int Main(string[] args)
    {
        Thread.CurrentThread.CurrentCulture = CultureInfo.InvariantCulture;
        try
        {
            if (args.Length == 3 && args[0] == "xml2ycd") { XmlToYcd(args[1], args[2]); return 0; }
            if (args.Length == 3 && args[0] == "ycd2xml") { YcdToXml(args[1], args[2]); return 0; }
            if (args.Length == 3 && args[0] == "batch")
            {
                Directory.CreateDirectory(args[2]);
                var files = Directory.GetFiles(args[1], "*.ycd.xml");
                Array.Sort(files, StringComparer.Ordinal);
                foreach (var f in files)
                {
                    var name = Path.GetFileName(f);
                    name = name.Substring(0, name.Length - ".ycd.xml".Length);
                    XmlToYcd(f, Path.Combine(args[2], name + ".ycd"));
                }
                return 0;
            }
            Console.Error.WriteLine("usage: ycdtool xml2ycd <in.xml> <out.ycd> | ycd2xml <in.ycd> <out.xml> | batch <xml-dir> <out-dir>");
            return 1;
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine("ycdtool error: " + ex.Message);
            return 1;
        }
    }

    private static void XmlToYcd(string input, string output)
    {
        var ycd = XmlYcd.GetYcd(File.ReadAllText(input));
        if (ycd?.ClipDictionary == null) throw new InvalidDataException("no ClipDictionary in " + input);
        var data = ycd.Save();
        File.WriteAllBytes(output, data);
        Console.WriteLine($"{Path.GetFileName(output)}: {data.Length} bytes, {ycd.ClipDictionary.ClipMap?.Count ?? 0} clips, {ycd.ClipDictionary.AnimMap?.Count ?? 0} animations");
    }

    private static void YcdToXml(string input, string output)
    {
        var data = File.ReadAllBytes(input);
        var entry = RpfFile.CreateResourceFileEntry(ref data, 46);
        data = ResourceBuilder.Decompress(data);
        var ycd = new YcdFile();
        ycd.Load(data, entry);
        if (ycd.ClipDictionary == null) throw new InvalidDataException("could not parse " + input + " " + ycd.LoadException);
        File.WriteAllText(output, YcdXml.GetXml(ycd));
        Console.WriteLine($"{Path.GetFileName(input)}: {ycd.ClipMap.Count} clips, {ycd.AnimMap.Count} animations");
    }
}
